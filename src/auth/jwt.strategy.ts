import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcnNhAAAAAwEAAQAAAYEAzsycla9Bm8YFK5EzovVnpLPnjE51kzZWp9EFWu91hoGVt+PyNgM4+0v70wrJTNErrYaRKpzvCRJTW3gJIpVpfxQR9+s+OdaJdCO2LmuqCMHTpfKMj1oKCzKyUf',
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
