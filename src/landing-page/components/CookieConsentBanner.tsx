import { useRef } from 'react';

import PreferencesDialog from './PreferencesDialog.tsx';

const CookieConsentBanner = () => {
  const preferencesRef = useRef();

  return (
    <div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-500 text-white p-4 flex justify-between items-center">
        <div>
          <p className="font-bold">This website uses cookies</p>
          <p>
            We use cookies to ensure you get the best experience on our website.
          </p>
        </div>
        <button
          className="bg-white text-blue-500 px-4 py-2 rounded"
          onClick={() => {
            (preferencesRef.current! as any).open();
          }}
        >
          Open Preferences
        </button>
      </div>
      {/* <div id='cookieconsent'></div> */}
      <PreferencesDialog ref={preferencesRef} />
    </div>
  );
};

export default CookieConsentBanner;
