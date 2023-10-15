import { selector } from "recoil";
import { courseState } from "../atom/courses";

export const courseDescription = selector({
  key: "courseDescriptionState",
  get: ({ get }) => {
    const state = get(courseState);
    if (state.course) {
      return state.course.description;
    }
    return "";
  },
});

export const courseTitle = selector({
  key: "courseTitleState",
  get: ({ get }) => {
    const state = get(courseState);
    if (state.course) {
      return state.course.title;
    }
    return "";
  },
});

export const coursePrice = selector({
  key: "coursePriceState",
  get: ({ get }) => {
    const state = get(courseState);
    if (state.course) {
      return state.course.price;
    }
    return "";
  },
});

export const courseImage = selector({
  key: "courseImageState",
  get: ({ get }) => {
    const state = get(courseState);
    if (state.course) {
      return state.course.imageLink;
    }
    return "";
  },
});
