import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({name:"Usuario"})
export class UsuarioEntity {

    @PrimaryGeneratedColumn()
    Id?:number;

    @Column()
    name?: string;


}
