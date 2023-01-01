import LoginUser from "../entity/LoginUser";

class UserInfoDAO {
  private static instance: UserInfoDAO = new UserInfoDAO();
  localKey: string = 'huhuiyu.teach-project-userinfo';
  load(): LoginUser {
    let user = localStorage.getItem(this.localKey)
    if (user) {
      return JSON.parse(user)
    }
    return new LoginUser()
  }
  save(loginUser: LoginUser | null): void {
    if (loginUser == null) {
      localStorage.removeItem(this.localKey)
    } else {
      localStorage.setItem(this.localKey, JSON.stringify(loginUser))
    }
  }

  static getInstance() {
    return this.instance
  }

  private constructor() { }



}
export default UserInfoDAO