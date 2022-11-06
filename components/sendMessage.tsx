import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const SendMessage = ({ ...props }) => {
  const { address } = useAccount();
  const router = useRouter();

  const [addressInputVisible, setAddressInputVisible] = useState(false);
  const { register, setValue, handleSubmit } = useForm();
  const [formData, setFormData] = useState("");
  const onSubmit = (formData: any) => {
    console.log(formData);
    async function postMessage() {
      const request: any = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          message: formData.message,
          from: address,
          to: null,
        }),
      });
      const data = await request.json();
    }
    postMessage().then(() => {
      props.setModalSelection(1);
    });
  };

  const handleAudienceSelection = (value: any) => {
    value == "DM"
      ? setAddressInputVisible(true)
      : setAddressInputVisible(false);
  };

  useEffect(() => {
    const handleMessageAll = () => {
      setValue("audience", "everyone");
      setValue("address", null);
    };

    const handleMessageOne = (addressInput: string) => {
      setValue("audience", "DM");
      setAddressInputVisible(true);
      setValue("address", addressInput);
    };

    if (props.recipient === "all") {
      handleMessageAll();
    }

    if (props.recipient === "random") {
      handleMessageOne("0x...random");
    }
  }, [props.recipient, setValue]);

  return (
    <>
      {!address ? (
        <ConnectButton label="Connect account" />
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-greydark text-white rounded-lg p-4 font-mono space-y-8"
          >
            <div className="w-full">
              <label htmlFor="audience" className="block text-2xl uppercase">
                To:
              </label>
              <select
                {...register("audience")}
                onChange={(e) => handleAudienceSelection(e.target.value)}
                id="audience"
                name="audience"
                autoComplete="audience"
                className="h-10 text-xl px-2 rounded-md bg-greylight/25 uppercase w-full"
              >
                <option>everyone</option>
                <option>DM</option>
              </select>
              {addressInputVisible ? (
                <input
                  {...register("recipient")}
                  type="text"
                  name="recipient"
                  id="recipient"
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
                {...register("message")}
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
            <p>{formData}</p>
          </form>
        </>
      )}
    </>
  );
};

export default SendMessage;
