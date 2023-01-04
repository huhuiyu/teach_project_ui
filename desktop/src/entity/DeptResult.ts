class DeptInfo {
  deptId: number = 0
  deptInfo: string = ''
  deptName: string = ''
  lastupdate: string = ''
}
class Employee {
  deptId: number = 0
  employeeId: number = 0
  employeeName: string = ''
  lastupdate: string = ''
  phone: string = ''
  dept: DeptInfo = new DeptInfo()
}
export { DeptInfo as DeptInfo, Employee as Employee }
