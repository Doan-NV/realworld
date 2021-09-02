import { jwtConstants } from 'src/user/auth/auth.constants';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
export class GetUserId {
  constructor(private jwtService: JwtService) {}

  async getUserIdFromToken(authorization: string) {
    if (!authorization) {
      return null;
    }

    const token = authorization.split(' ')[1];
    console.log(token);
    const decode = jwt.verify(token, jwtConstants.secret);
    return decode;
  }
}
