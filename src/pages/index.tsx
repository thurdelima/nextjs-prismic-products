import {Title} from '../styles/pages/Home';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents'
import PrismicDOM from 'prismic-dom';


interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts}: HomeProps) {
  
  // const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);
  
  // useEffect(() => {
    
  //   //caso n ser necessario indexar esses dados no motor de busca(isso so roda se o javascript estiver habilitado no navegador)
  //   fetch('http://localhost:3333/recommended').then(response => {
  //     response.json().then(data => {
  //       setRecommendedProducts(data);
  //     })
  //   })
   
  // }, [])

  async function handleSum() {
    //utilizando import dinamico
    const math = (await import('../lib/math')).default;
    
    alert(math.sum(3,2));
  }
  
  return (
    <div>
      <SEO 
        title="DevCommerce, your best e-commerce!" 
        image="boost.png"
        shouldExcludeTitleSuffix />

      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                
                <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                  <a>
                   {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
         

                  </a>
                  
                </Link>
                 
              </li>
            )
          })}
        </ul>
      </section>

      <button onClick={handleSum}>

        Somar
      </button>
      
    </div>
  )
}

// criar variaveis de ambiente no .env com next
// API_URL=http://localhost:3333


//deixar ela publica para acessar no html
// NEXT_PUBLIC_API_URL=http://localhost:3333

//formas de puxar dados
//client side, server side, static side


//usamos o serversideprops para infos q precisam ser indexadas por motores de busca
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  // const response = await fetch(`${process.env.API_URL}/recommended`);
  // const recommendedProducts = await response.json();

  //chamada api prismic
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);
      
  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  }
}
