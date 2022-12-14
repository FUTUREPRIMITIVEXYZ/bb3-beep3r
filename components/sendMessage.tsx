import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSigner } from "wagmi";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { useProvider } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

const SendMessage = ({ ...props }) => {
  const { address } = useAccount();
  const router = useRouter();
  const provider = useProvider();
  const queryClient = useQueryClient();

  const [addressInputVisible, setAddressInputVisible] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState("");

  const { data: signer, isError, isLoading } = useSigner();
  const [xmtpClient, setXmtpClient] = useState<Client>();

  const onSubmit = useCallback(
    (formData: any) => {
      console.log(formData);
      async function postMessage() {
        if (signer && formData.message) {
          const xmtp = await Client.create(signer);
          try {
            let wallet = null;
            let conversation = null;

            if (formData.recipient) {
              if (formData.recipient.includes(".eth")) {
                try {
                  wallet = await provider.resolveName(formData.recipient);
                } catch (e) {
                  /* handle error */
                  alert("Invalid .eth");
                }
              } else {
                wallet = formData.recipient;
              }

              console.log(wallet);

              conversation = await xmtp.conversations.newConversation(wallet);
            } else {
              conversation = await xmtp.conversations.newConversation(
                "0x30363923590B9337D8Be5Ea0b030bAC0fD7970a4"
              );
            }

            await conversation.send(formData.message);
            queryClient.invalidateQueries([
              { queryKey: ["announcements"] },
              { queryKey: ["convos"] },
            ]);
          } catch (e) {
            /* handle error */
          }
        }
      }
      postMessage().then(() => {
        props.setModalSelection(1);
      });
    },
    [props, provider, signer, queryClient]
  );

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
        <ConnectButton label="Connect account" chainStatus="none" />
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

            {signer ? (
              <button
                type="submit"
                className="w-fit h-12 bg-greydark mb-2 flex justify-center items-center"
              >
                <p className="w-full h-full bg-greylight/25 px-12 pt-2 text-2xl text-white font-mono uppercase cursor-pointer">
                  send ???
                </p>
              </button>
            ) : (
              <ConnectButton chainStatus="none" />
            )}
            <p>{formData}</p>
          </form>
        </>
      )}
    </>
  );
};

export default SendMessage;
