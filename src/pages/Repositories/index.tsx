import React, { useEffect, useState } from 'react';
import { useRouteMatch , Link} from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Header, RepositoryInfo, Issues } from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number,
  forks_count: number,
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

interface Issue {
  title: string;
  id: number;
  user: {
    login: string;
  }
  html_url: string;
}

const Repositories: React.FC = () => {
  const [ repository, setRepository ] = useState<Repository | null>(null);
  const [ issues, setIssues ] = useState<Issue[]>([]);
  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    const loadIssues = async() => {

     const response = await Promise.all([
       api.get(`repos/${params.repository}`),
       api.get(`repos/${params.repository}/issues`)
     ]);
      console.log(response[1].data);
      setRepository(response[0].data);
      setIssues(response[1].data);
    }

    loadIssues();
  }, [params.repository]);

  return (
  <>
    <Header>
      <img src={logoImg} alt="logo" />
      <Link to="/">
        <FiChevronLeft size={16}/>
        Voltar
      </Link>
    </Header>

    { repository && (
      <RepositoryInfo>
      <header>
        <img src={repository.owner.avatar_url} alt="avatar"/>
        <div>
          <strong>{repository.full_name}</strong>
          <p>{repository.description}</p>
        </div>
      </header>

      <ul>
        <li>
          <strong>{repository.stargazers_count}</strong>
          <span>Stars</span>
        </li>

        <li>
          <strong>{repository.forks_count}</strong>
          <span>Forks</span>
        </li>

        <li>
          <strong>{repository.open_issues_count}</strong>
          <span>Issues Abertas</span>
        </li>
      </ul>
    </RepositoryInfo>
    ) }

    <Issues>
      {issues.map( issue => (
        <a key={issue.id} href={issue.html_url}>
          <div>
            <strong>{issue.title}</strong>
            <p>{issue.user.login}</p>
          </div>
          <FiChevronRight size={20}/>
        </a>
      ))}
    </Issues>
  </>
  );
}

export default Repositories;