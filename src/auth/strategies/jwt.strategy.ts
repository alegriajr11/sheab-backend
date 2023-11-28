/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/constants';
import { PayloadInterface } from '../payload.interface';
import { MessageDto } from 'src/common/message.dto';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET)
    });
  }

  async validate(payload: PayloadInterface) {
    const {usu_nombreUsuario, usu_email} = payload;
    const usuario = await this.authRepository.findOne({where: [{usu_nombreUsuario: usu_nombreUsuario},{usu_email: usu_email}]})
    if(!usuario) return new UnauthorizedException(new MessageDto('Credenciales Erroneas'));
    return usuario;

}
}