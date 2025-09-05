import {staffRoles} from './roles';



export const checkStaffOrStudent = (user) => {
    // console.log(user);
    let role = user?.role;
    if(role === 'student'){
        return 'student';
    }
    else if(staffRoles.includes(role)){
        return 'staff';
    }
    else{
        return false;
    }

}