import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "Produto" })
export class ProdutoEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({ nullable: false })
    descricao?: string;

    @Column({ nullable: false})
    genero?: number;

    @Column({nullable: false})
    tamanho?: string;

    @Column({nullable: false})
    material?: string;

    @Column({nullable: false,type: "float"})
    preco?: number;

    // marcaId

    // usuarioId

    // categoriaId

}