import { atom } from "recoil";

const userState = atom({
  key: "userState",
  default: {
    email: null,
    password: null,
  },
});

export default userState;
