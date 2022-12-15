import { Column, Entity,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./Usuario";



@Entity({ name: "Cliente" })
export class ClienteEntity {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column({nullable: false})
    nome!: string;

    @Column({nullable: false})
    contato!: string;

    @ManyToOne(() => UsuarioEntity,(usuario)=> usuario.Id)
    usuario!: UsuarioEntity | null;

}