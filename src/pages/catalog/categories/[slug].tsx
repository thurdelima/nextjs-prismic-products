import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import Link from 'next/link';
import PrismicDOM from 'prismic-dom';


interface CategoryProps {
    category: Document;
    products: Document[];
}

export default function Category({ category, products }: CategoryProps) {
    const router = useRouter();

    if(router.isFallback) {
        return <p>Carregando...</p>
    }
  
  return (
      <div>
        <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>

        <ul>
        {products.map(product => {
            return (
              <li key={product.id}>
                
                <Link href={`/catalog/products/${product.uid}`}>
                  <a>
                   {PrismicDOM.RichText.asText(product.data.title)}
         

                  </a>
                  
                </Link>
                 
              </li>
            )
          })}
        </ul>
      </div>
    )
}


//puxa todos os caminhos q temos com base no backend
export const getStaticPaths: GetStaticPaths = async (context) => {
    
    //chamada prismic
    //const category = await client().getByUID('category', String(slug) , {});
   
    const categories = await client().query([
        Prismic.Predicates.at('document.type', 'category')

    ])
    
    //caso ter 800 categorias, n faz sentido puxar tudo isso, pode passar o return como {paths: [], fallback: true}
    // const response = await fetch(`http://localhost:3333/categories`);
    // const categories = await response.json();

    const paths = categories.results.map(category => {
        
        //uid e o slug
        return {
            params: {slug: category.uid}

        }
    })


    return {
        paths,
        //com o fallback true, apos o yarn build, se criarmos mais dados no back e n for gerada a rota dinamica, ele realiza a geracao pra nos sem o yarn build
        fallback: true,
    }
}


// o getstaticprops usamos para paginas q n sofrem mudanca em seus dados no banco de dados (ex: post de blog),
// ela sera gerada de gorma estatica para ganharmos performance no carregamento do front end
export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params;  

    
    //chamada prismic
    const category = await client().getByUID('category', String(slug) , {});
   
    const products = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.at('my.product.category', category.id)

    ])
   
    //chamada fetch cliente normal
    // const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
    // const products = await response.json();
    
    return {
        props: {
            category,
            products: products.results,
        },  
        //com o revalidate, a cada 5 segundos, o next precisa gerar uma atualizacao dessa pagina pra mim
        revalidate: 60,
    }
}
  