import { Column, Entity,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./Usuario";



@Entity({ name: "Fornecedor" })
export class FornecedorEntity {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column({nullable: false})
    descricao!: string;

    @Column({nullable: false})
    contato!: string;

    @ManyToOne(() => UsuarioEntity,(usuario)=> usuario.Id)
    usuario!: UsuarioEntity | null;

}