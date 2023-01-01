import { defineStore } from "pinia";
import UserInfoDAO from "../dao/UserInfoDAO";

const store = defineStore('main', {
  state: () => {
    return {
      loginUser: UserInfoDAO.getInstance().load()
    }
  },
  actions: {
  }
});

export default store