import Cookies from "js-cookie";

export function RemoveCookie(cookieName) {
    Cookies.remove(cookieName);
}

export function GetCookie(cookieName) {
    return Cookies.get(cookieName);
}

export function SetCookie(cookieName, token) {
    Cookies.set(cookieName, token, {
        expires: 30,
        secure: false,
        sameSite: "strict",
        path: "/",
    });
}
