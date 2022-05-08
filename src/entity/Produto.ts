import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "Produto" })
export class ProdutoEntity {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({nullable: true})
    codigo?: string;

    @Column({ nullable: false })
    descricao?: string;
    
    @Column({nullable: false})
    tamanho?: string;

    @Column({ nullable: false})
    genero?: number;

    @Column({nullable: false})
    cor?: string;

    @Column(({nullable:false,default: 0}))
    estoque?: number;


    // "codigo": values.codigo,
    // //   "descricao": values.descricao,
    // //   "tamanho": values.tamanho,
    // //   "genero": values.genero,
    // //   "cor": values.cor,
    // //   "estoque": values.estoque



    // marcaId

    // usuarioId

    // categoriaId

}