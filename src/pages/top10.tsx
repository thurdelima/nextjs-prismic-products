import { GetStaticProps } from "next"

interface IProduct {
    id: string;
    title: string;
}

interface Top10Props {
    products: IProduct[];
}

export default function Top10({products}: Top10Props) {
    return (
        <div>
            <h1>Top 10</h1>

            <ul>
                {products.map(recommendedProduct => {
                    return (
                    <li key={recommendedProduct.id}>
                        {recommendedProduct.title}
                    </li>
                    )
                })}
            </ul>
        </div>
    )
}


// o getstaticprops usamos para paginas q n sofrem mudanca em seus dados no banco de dados (ex: post de blog),
// ela sera gerada de gorma estatica para ganharmos performance no carregamento do front end
export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
    const response = await fetch('http://localhost:3333/products');
    const products = await response.json();
    
    return {
        props: {
            products,
        },
        //com o revalidate, a cada 5 segundos, o next precisa gerar uma atualizacao dessa pagina pra mim
        revalidate: 5,
    }
}