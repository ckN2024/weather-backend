import { CognitoJwtVerifier } from "aws-jwt-verify";

const newGetDataFromToken = async (access_token) => {
  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: "access",
    clientId: process.env.COGNITO_CLIENT_ID,
  });

  try {
    const payload = await verifier.verify(
      access_token // the JWT as string
    );
    // console.log("new: Token is valid. Payload: \n", payload);
    return {
        data: payload,
        message: "Token verified"
    }
  } catch (error) {
    // console.log("new: Token not valid!");
    return {
        data: null,
        message: error.message
    }
  }
};

export default newGetDataFromToken;
