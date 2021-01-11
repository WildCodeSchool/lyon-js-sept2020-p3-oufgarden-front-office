import React, { useState, useEffect /* useContext  */ } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Select from 'react-select';
import { getCollection } from '../services/API';
import './style/Feed.scss';

/* import { UserContext } from './Contexts/UserContextProvider'; */

const Feed = () => {
  /*  const { userDetails } = useContext(UserContext); */

  const [articles, setArticles] = useState([]);
  const [articlesFiltered, setArticlesFiltered] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    getCollection('articles').then((elem) => {
      setArticles(elem);
    });
  }, []);

  const articleOption = articles.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.title}`,
    };
  });

  const handleSelectArticleChange = (elem) => {
    if (!elem) {
      setArticlesFiltered([]);
    } else {
      setArticlesFiltered(elem.map((e) => e.value));
    }
  };

  useEffect(() => {
    getCollection('tags').then((data) => setAllTags(data));
  }, []);

  useEffect(() => {
    getCollection('tagToArticle').then((result) => {
      const articleToFilter = result
        .filter((article) => {
          if (tagList.includes(article.tag_id)) {
            return true;
          }
          return false;
        })
        .map((article) => {
          return article.article_id;
        });
      setArticlesFiltered(articleToFilter);
    });
  }, [tagList]);

  const handleTagList = (target) => {
    if (tagList.includes(+target.id)) {
      const newTagList = tagList.filter((item) => item !== +target.id);
      setTagList(newTagList);
    } else {
      setTagList((prevState) => [...prevState, +target.id]);
    }
  };

  return (
    <div className="containerFeed">
      <div className="searchArticleSelect">
        <Select
          isMulti
          name="articles"
          placeholder="rechercher votre articles"
          options={articleOption}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => {
            handleSelectArticleChange(e);
          }}
        />
      </div>
      {/* <button type="button" className="buttonPres">
        Like
      </button> */}
      <div className="filterContainer">
        {allTags &&
          allTags.map((tag) => {
            return (
              <div key={tag.id}>
                <button
                  type="button"
                  className="filterButton"
                  id={tag.id}
                  onClick={(e) => handleTagList(e.target)}
                >
                  {tag.name}
                </button>
              </div>
            );
          })}
      </div>
      <div className="articleListContainer">
        {articlesFiltered.length > 0
          ? articles
              .filter((article) => {
                if (articlesFiltered.includes(article.id)) {
                  return true;
                }
                return false;
              })
              .map((e) => {
                return (
                  <div key={e.id} className="articlesRow">
                    <div className="articlesInfos">
                      <img className="imgArticle" src={e.url} alt="jardin" />
                      <div className="text">
                        {ReactHtmlParser(e.title)}
                        <br />
                        {ReactHtmlParser(e.content)}
                      </div>
                    </div>
                  </div>
                );
              })
          : articles.map((e) => {
              return (
                <div key={e.id} className="articlesRow">
                  <div className="articlesInfos">
                    <img className="imgArticle" src={e.url} alt="jardin" />
                    <div className="text">
                      {ReactHtmlParser(e.title)}
                      <br />
                      {ReactHtmlParser(e.content)}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
export default Feed;
