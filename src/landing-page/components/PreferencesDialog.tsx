import { createRef, forwardRef, useImperativeHandle, useState } from 'react';

const range = (from: number, to: number) =>
  [...Array(Math.floor(to - from) + 1)].map((_, i) => from + i);

const asciiCodes: number[] = [
  ...range(33, 126),
  128,
  ...range(130, 140),
  142,
  ...range(145, 156),
  158,
  159,
  ...range(161, 172),
  ...range(174, 255),
];

const createCaptcha = (length: number = 8): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(
      asciiCodes[Math.floor(Math.random() * (asciiCodes.length - 1))]
    );
  }
  return result;
};

const PreferencesDialog = forwardRef((props, ref) => {
  const dialogRef = createRef<HTMLDialogElement>();

  const timeout: number = 10;
  const SECOND: number = 1000;

  const [getCaptcha, setCaptcha] = useState(createCaptcha());
  const [getTimer, setTimer] = useState(timeout * SECOND);
  const [disabled, setDisabled] = useState(true);

  let timer = timeout * SECOND;

  let timerInterval: number | undefined = undefined;

  useImperativeHandle(ref, () => ({
    open() {
      setTimer(timeout * SECOND);

      const dialog: HTMLDialogElement = dialogRef.current!;
      dialog.showModal();

      if (timerInterval) {
        clearInterval(timerInterval);
      }

      timerInterval = setInterval(() => {
        timer = timer - SECOND;

        if (timer <= 0) {
          timer = timeout * SECOND;
          setCaptcha(createCaptcha());
        }
        setTimer(timer);
      }, SECOND);
    },
  }));

  return (
    <dialog ref={dialogRef} className="rounded">
      <div className="mx-4 my-2">
        <h4 className="text-xl">Save preferences</h4>
      </div>
      <div>
        <div id="captcha" className="px-4 py-4">
          <div className="border-l-4 border-yellow-400 px-2 py-2 bg-yellow-50 mb-6">
            To save your preferences, <br />
            please repeat the following captcha.
          </div>
          <div className="captcha bg-gray-200 text-gray-700 rounded text-center my-4 p-2 select-none">
            {getCaptcha}
          </div>
          <div className="timer text-xs">
            <span>
              Captcha resets in <span id="timeout">{getTimer / 1000}</span>S
            </span>
          </div>
          <form className="form">
            <input
              type="text"
              className="w-full rounded"
              onChange={(evt) => {
                const value: string = evt.target.value!;
                if (getCaptcha === value) {
                  setDisabled(false);
                }

                if (Math.random() > 0.75) {
                  evt.target.blur();
                }
              }}
            />
          </form>
        </div>
      </div>
      <div className="m-4 flex items-end justify-between">
        <button
          className="bg-slate-100 px-4 py-2 rounded"
          onClick={() => {
            dialogRef.current!.close();
          }}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </dialog>
  );
});

export default PreferencesDialog;
