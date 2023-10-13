import { atom } from "recoil";

const coursesState = atom({
  key: "coursesState",
  default: {
    course: null,
  },
});
