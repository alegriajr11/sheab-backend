import { IsObject, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { PrestadorEntity } from "../prestador.entity";
import { SedeMunicipioEntity } from "../sede/sede_municipio/sede-municipio.entity";

export class SedeDto {

    @IsNotBlank()
    @IsString()
    @MaxLength(3, {message: 'EL numero debe tener una longitud máxima de 3 caracteres'})
    sede_numero: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(100, {message: 'El nombre debe tener una longitud máxima de 105 caracteres'})
    sede_nombre: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(70, {message: 'El gerente debe tener una longitud máxima de 70 caracteres'})
    sede_gerente: string
    
    @IsNotBlank()
    @IsString()
    @MaxLength(3, {message: 'La sede principal debe tener una longitud máxima de 105 caracteres'})
    sede_principal: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(2, {message: 'El numero de sede principal debe tener una longitud máxima de 105 caracteres'})
    sede_numero_principal: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(90, {message: 'La direccion debe tener una longitud máxima de 105 caracteres'})
    sede_direccion: string;
    
    @IsNotBlank()
    @IsString()
    @MaxLength(90, {message: 'El barrio debe tener una longitud máxima de 105 caracteres'})
    sede_barrio: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(100, {message: 'El telefono debe tener una longitud máxima de 100 caracteres'})
    sede_telefono: string

    @IsNotBlank()
    @IsString()
    @MaxLength(120, {message: 'El email debe tener una longitud máxima de 120 caracteres'})
    sede_email: string

    @IsObject({
        message: 'El prestador no puede estar vacio'
    })
    sede_prestador: PrestadorEntity

    @IsObject({
        message: 'El Municipio no puede estar vacio'
    })
    sede_municipio: SedeMunicipioEntity;

}
