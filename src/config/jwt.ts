import jwt from "jsonwebtoken";
import { envConfigs } from "./envconfig";


const secret = envConfigs.jwt_secret 

const setUser = (payload: { id: number,role:string }) => {
  const { id,role } = payload;

  return jwt.sign(
    {
      userId: id,
      role:role
    },
    secret, 
    {
      expiresIn: "24h", 
    }
  );
};


const getUser = (token: string) => {
  try {
    const newToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    return jwt.verify(newToken, secret);
  } catch (error) {
    
    throw new Error("Invalid token");
  }
};

export { setUser, getUser };
