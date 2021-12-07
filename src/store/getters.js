const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 登录后的token
  token: state => state.user.token,
  // 登录人的头像
  avatar: state => state.user.userInfo.staffPhoto,
  // 登录人的用户名
  name: state => state.user.userInfo.username,
  // 部门
  deptName: state => state.user.userInfo.departmentName,
  // 手机号
  mobile: state => state.user.userInfo.mobile,
  // 工号
  workNumber: state => state.user.userInfo.workNumber

}
export default getters
