import {staffRoles} from './roles';



export const checkStaffOrStudent = (role) => {
    // console.log(user);
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