import { atom } from "recoil";

const userState = atom({
  key: "userState",
  default: {
    email: null,
  },
});

export default userState;
