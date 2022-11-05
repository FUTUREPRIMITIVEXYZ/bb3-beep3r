const SendMessage = () => {
  return (
    <>
      <form className="bg-white/25 rounded-lg p-4">
        <div>
          <label
            htmlFor="message"
            className="block font-medium text-white text-3xl uppercase"
          >
            To:
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="w-full">
              <label htmlFor="country" className="sr-only">
                Country
              </label>
              <select
                id="audience"
                name="audience"
                autoComplete="audience"
                className="h-full rounded-md border border-bpr-green py-0 pl-3 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option>message all</option>
                <option>DM</option>
              </select>
              <input
                type="text"
                name="adress"
                id="address"
                className="h-full rounded-md border border-bpr-green py-0 pl-3 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0x..."
              />
            </div>
            <textarea
              name="message"
              id="message"
              className="block w-full rounded-md border border-bpr-green bg-black pl-16 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="send a message"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default SendMessage;
