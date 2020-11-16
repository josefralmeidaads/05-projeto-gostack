import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { Container, Title, Form, Repositories } from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

const Dashboard: React.FC = () => {
    toast.configure();
    const [repositories, setRepositories] = useState<Repository[]>(() => {
      const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

      if(storagedRepositories) {
        return JSON.parse(storagedRepositories);
      } else {
        return [];
      }

    });
    const [finderRepository, setFinderRepository] = useState('');

    useEffect(() => {
      localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    const handleAddRepository = async(event:FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      try{
        const response = await api.get<Repository>(`repos/${finderRepository}`);
        setRepositories([...repositories, response.data]);
        setFinderRepository('');
      }catch{
        toast.error('Não foi encontrado nenhum repositório verifique o nome novamente!', {autoClose: 5000});
      }
        
    }

    return (
      <Container>  
        <img src={logoImg} alt="logo" />
        <Title>Explore repositórios no Github</Title>

        <Form onSubmit={handleAddRepository} >
          < input type="text" 
            placeholder="Digite o nome do repositório"
            onChange={(e) => setFinderRepository(e.target.value)}
            value={finderRepository}
          />
          <button type="submit">Pesquisar</button>
        </Form>

        <Repositories>
          {repositories[0] && repositories.map( repository => (
            <Link key={repository.owner.login} to={`/repositories/${repository.full_name}`}>
            <img 
              src={repository.owner.avatar_url} 
              alt={`${repository.owner}`}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20}/>
          </Link>
          ))}
        </Repositories>
      </Container>  
    )
}

export default Dashboard;