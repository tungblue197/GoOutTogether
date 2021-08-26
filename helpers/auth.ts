export const checkLogin = () => {
    return localStorage.getItem('uId') ? true : false;
}