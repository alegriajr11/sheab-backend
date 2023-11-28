/* eslint-disable prettier/prettier */
import { IsEmail, IsObject, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { MunicipioEntity } from "src/municipio/municipio.entity";
import { ClaseEntity } from "../clase/clase.entity";
import { ClasificacionEntity } from "../clasificacion/clasificacion.entity";
import { TipoEntity } from "../tipo/tipo.entity";
import { Column } from "typeorm";


export class CreatePrestadorDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(15, {message: 'Código habilitación: longitud máxima de 15'})
    pre_cod_habilitacion: string
    
    @IsNotBlank({message: 'el nombre no puede estar vacio'})
    @IsString()
    @MaxLength(100, {message: 'nombre: longitud máxima de 100'})
    pre_nombre: string;

    @IsNotBlank({message: 'el nit no puede estar vacio'})
    @IsString()
    @MaxLength(11, {message: 'nit: longitud máxima de 11'})
    pre_nit: string;

    @IsNotBlank({message: 'la dirección no puede estar vacio'})
    @IsString()
    @MaxLength(90, {message: 'dirección: longitud máxima de 90'})
    pre_direccion: string;

    @IsNotBlank({message: 'el número de telefono no puede estar vacio'})
    @IsString()
    @MaxLength(50, {message: 'telefono: longitud máxima de 50'})
    pre_telefono: string;

    @IsNotBlank({message: 'el email no puede estar vacio'})
    @IsEmail()                    
    pre_email: string;

    @IsString()
    // @MaxLength(3, {message: 'habilitado: longitud máxima de 3'})
    pre_habilitado: string;

    @Column({ nullable: true })
    pre_representante?: string;
    

    @IsObject({
        message: 'La clasificacion no puede estar vacia'
    })
    pre_clasificacion: ClasificacionEntity;

    @IsObject({
        message: 'La clase no puede estar vacia'
    })
    pre_clase: ClaseEntity

    @IsObject({
        message: 'El tipo no puede estar vacio'
    })
    pre_tipo: TipoEntity

    @IsObject({
        message: 'El Municipio no puede estar vacio'
    })
    pre_municipio: MunicipioEntity;

    

}