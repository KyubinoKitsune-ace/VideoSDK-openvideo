import { MP4File, mp4box } from 'wrapbox';

export function autoReadStream<ST extends ReadableStream>(
  stream: ST,
  cbs: {
    onChunk: ST extends ReadableStream<infer DT>
      ? (chunk: DT) => Promise<void>
      : never;
    onDone: () => void;
  }
) {
  let stoped = false;
  async function run() {
    const reader = stream.getReader();

    while (!stoped) {
      const { value, done } = await reader.read();
      if (done) {
        cbs.onDone();
        return;
      }
      await cbs.onChunk(value);
    }

    reader.releaseLock();
    await stream.cancel();
  }

  run().catch(console.error);

  return () => {
    stoped = true;
  };
}

export function file2stream(
  file: MP4File,
  timeSlice: number,
  onCancel?: () => void
): {
  stream: ReadableStream<Uint8Array>;
  stop: (err?: Error) => void;
} {
  let timerId = 0;

  let sendedBoxIdx = 0;
  const boxes = file.boxes;

  let firstMoofReady = false;
  const deltaBuf = (): Uint8Array | null => {
    if (!firstMoofReady) {
      if (boxes.find((box: any) => box.type === 'moof') != null) {
        firstMoofReady = true;
      } else {
        return null;
      }
    }
    if (sendedBoxIdx >= boxes.length) return null;

    const ds = new mp4box.DataStream();

    let i = sendedBoxIdx;
    try {
      for (; i < boxes.length; ) {
        boxes[i].write(ds);
        delete boxes[i];
        i += 1;
      }
    } catch (err) {
      const errBox = boxes[i];
      if (err instanceof Error && errBox != null) {
        throw Error(
          `${err.message} | deltaBuf( boxType: ${errBox.type}, boxSize: ${errBox.size}, boxDataLen: ${errBox.data?.length ?? -1})`
        );
      }
      throw err;
    }

    unsafeReleaseMP4BoxFile(file);

    sendedBoxIdx = boxes.length;
    return new Uint8Array(ds.buffer);
  };

  let stoped = false;
  let canceled = false;
  let exit: ((err?: Error) => void) | null = null;
  const stream = new ReadableStream({
    start(ctrl) {
      timerId = self.setInterval(() => {
        const d = deltaBuf();
        if (d != null && !canceled) ctrl.enqueue(d);
      }, timeSlice);

      exit = (err) => {
        clearInterval(timerId);
        file.flush();
        if (err != null) {
          ctrl.error(err);
          return;
        }

        const d = deltaBuf();
        if (d != null && !canceled) ctrl.enqueue(d);

        if (!canceled) ctrl.close();
      };

      if (stoped) exit();
    },
    cancel() {
      canceled = true;
      clearInterval(timerId);
      onCancel?.();
    },
  });

  return {
    stream,
    stop: (err) => {
      if (stoped) return;
      stoped = true;
      exit?.(err);
    },
  };
}

function unsafeReleaseMP4BoxFile(file: MP4File) {
  if (file.moov == null) return;
  for (var j = 0; j < file.moov.traks.length; j++) {
    file.moov.traks[j].samples = [];
  }
  file.mdats = [];
  file.moofs = [];
}
