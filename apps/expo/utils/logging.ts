// See logs at https://webhook.site/#!/42b9f54d-d06d-4f9f-a0cd-5ea89a010178/b6362d36-f36d-4a07-a946-da499a8d990d/1
const WEBHOOK_SITE_URL =
  "https://webhook.site/42b9f54d-d06d-4f9f-a0cd-5ea89a010178";
export const shittyLog = (message: Record<string, unknown>) => {
  if (__DEV__) {
    console.log(message);
  } else {
    fetch(WEBHOOK_SITE_URL, {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
