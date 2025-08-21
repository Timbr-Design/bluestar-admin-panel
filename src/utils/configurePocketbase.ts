import PocketBase from "pocketbase";

const pb = new PocketBase("http://timbrbluestar.duckdns.org")
// ("https://154e6420305e.ngrok-free.app");

const auth = async () => {
  try {
    // const authData = await pb.admins.authWithPassword(
    //   "yash@gmail.com",
    //   "yashjindal"
    // );
    const authData = await pb.collection('users').authWithPassword("yash@gmail.com",
      "yashjindal");

    console.log("Admin authenticated:", authData);
    console.log("Auth token:", pb.authStore.token);
    const date = new Date();
    const expiry = date.getTime() + 36000 * 10000000000;
    date.setTime(expiry);
    // const change = date.toUTCString();
    // document.cookie = `token=${pb.authStore.token};expires=${change};path=/`;
  } catch (error) {
    console.error("Admin authentication failed:", error);
  }
};

auth();

export default pb;
