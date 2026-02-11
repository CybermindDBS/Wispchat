import {update} from "../api/user.js";

export async function updateUser(name, password) {

    try {
        await update(name, password)
        return {ok: true}
    } catch {
        return {ok: false, error: "Something went wrong, try again later."};
    }
}