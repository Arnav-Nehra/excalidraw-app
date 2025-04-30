"use client";
import { Button, Input, Loader } from "@repo/ui";
import axios from "axios";
import { HTTP_BACKEND } from "../../config";
import { headers } from "next/headers";
import { RefObject, useEffect, useReducer, useRef, useState } from "react";
import { error } from "console";

async function createRoomHandler(
  roomname: RefObject<HTMLInputElement | null>,
  token: string | null,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRoom: React.Dispatch<React.SetStateAction<string>>
) {
  setLoading(true);
  const response = await axios
    .post(
      `${HTTP_BACKEND}/room`,
      {
        name: roomname.current?.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      setLoading(false);
      if (response.data.roomId) {
        setRoom(`room created : ${response.data}`);
      }
      if (response.data.message === "incorrect inputs") {
        setError("enter minimum 3 letters");
      } else if (
        response.data.message === "room with same name is already present"
      ) {
        setError("room already exists");
      }
      setTimeout(() => {
        setError("");
        setRoom("")
      }, 3000);
    })
    .catch((error) => {
      setLoading(false);
      if (error.message == "Request failed with status code 500") {
        console.log(error);
        setError("Invalid Token");
      } else if (error.status == 403) {
        setError("Unauthorized");
      } else if (error.status == 411) {
        setError("enter atleast 3 characters");
      }
      setTimeout(() => {
        setError("");      
    }, 2000);
    });
}
export default function createRoom() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [room, setRoom] = useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      console.log("no token found in local storage");
    }
  }, []);

  const roomNameref = useRef<HTMLInputElement | null>(null);

  return (
    <div className="">
      <section className="py-40 min-h-screen place-items-center bg-white">
        <div className="container">
          <div className="flex flex-col gap-4">
            <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow ">
              <div className="mb-6 flex flex-col items-center">
                <a className="mb-6 flex items-center gap-2">
                  <img className="max-h-20" />
                </a>
                <h1 className="mb-2 text-2xl font-bold text-black">
                  Create Room
                </h1>
              </div>
              <div>
                <div className="grid gap-8 text-black mt-10 ">
                  <Input
                    id="roomname"
                    type="roomname"
                    ref={roomNameref}
                    placeholder="Enter Room Name"
                    className="p-2"
                    required
                  />

                  <Button
                    className="bg-black flex gap-6 text-white  hover:bg-gray-800"
                    onClick={() => {
                      createRoomHandler(
                        roomNameref,
                        token,
                        setError,
                        setLoading,
                        setRoom
                      );
                    }}
                  >
                    Create
                    {loading && <Loader />}
                  </Button>
                  <div>
                    {error} &&
                      <div className="text-center text-red-500 bg-red-100 p-2 rounded-md">
                        {error}
                      </div>
                    </div>
                </div>
                <div>
                  {room && (
                    <div className="text-center text-green- bg-red-100 p-2 rounded-md">
                      {error}{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
