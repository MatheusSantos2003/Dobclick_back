import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "Usuario" })
export class UsuarioEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({ nullable: false })
    nome?: string;

    @Column({ nullable: false })
    email?: string;

    @Column({ nullable: false })
    senha?: string;

    @Column({ nullable: false })
    foto?: string;

}
