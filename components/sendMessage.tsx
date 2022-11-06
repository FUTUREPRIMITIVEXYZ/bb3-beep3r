import { useState } from "react";

const SendMessage = ({ ...props }) => {
  const [addressInputVisible, setAddressInputVisible] = useState(false);
  const handleAudienceSelection = (value: any) => {
    value == "DM"
      ? setAddressInputVisible(true)
      : setAddressInputVisible(false);
  };
  return (
    <>
      <form className="bg-greydark text-white rounded-lg p-4 font-mono space-y-8">
        <div className="w-full">
          <label htmlFor="audience" className="block text-2xl uppercase">
            To:
          </label>
          <select
            onChange={(e) => handleAudienceSelection(e.target.value)}
            id="audience"
            name="audience"
            autoComplete="audience"
            className="h-10 text-xl px-2 rounded-md bg-greylight/25 uppercase w-full"
          >
            <option>everyone (75 wallets)</option>
            <option>DM</option>
          </select>
          {addressInputVisible ? (
            <input
              type="text"
              name="adress"
              id="address"
              className="h-10 mt-4 text-xl px-2 rounded-md bg-greylight/25  w-full"
              placeholder="0x..."
            />
          ) : (
            <></>
          )}
        </div>
        <div>
          <label htmlFor="message" className="block text-3xl uppercase">
            Message:
          </label>
          <textarea
            name="message"
            id="message"
            className="block w-full h-64 rounded-md bg-greylight/25 p-2"
            placeholder="I'm at EthGlobal SF rn, wyd?"
          />
        </div>
        <button
          type="submit"
          className="w-fit h-12 bg-greydark mb-2 flex justify-center items-center"
        >
          <p className="w-full h-full bg-greylight/25 px-12 pt-2 text-2xl text-white font-mono uppercase cursor-pointer">
            send ⭢
          </p>
        </button>
      </form>
    </>
  );
};

export default SendMessage;
