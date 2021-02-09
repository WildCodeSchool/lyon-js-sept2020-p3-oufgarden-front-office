/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { getCollection } from '../services/API';
import './style/Feed.scss';
import { LoginContext } from './_context/LoginContext';

const URL = process.env.REACT_APP_API_BASE_URL;

const Feed = () => {
  const [articles, setArticles] = useState([]);
  const [articlesFiltered, setArticlesFiltered] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [favorite, setFavorite] = useState([]);
  const [favoriteId, setFavoriteId] = useState(false);
  const [showFavoriteList, setShowFavoriteList] = useState(false);
  const { setIsLogged, setUserDetails } = useContext(LoginContext);
  useEffect(() => {
    getCollection('currentUser').then((infos) => {
      setIsLogged(true);
      setUserDetails(infos);
    });
  }, []);

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
      target.classList.toggle('selected-tag-filter');
    } else {
      setTagList((prevState) => [...prevState, +target.id]);
      target.classList.toggle('selected-tag-filter');
    }
  };

  useEffect(() => {
    getCollection('articles/favorites').then((data) => setFavorite(data));
  }, []);

  useEffect(() => {
    if (favorite.length > 0) {
      setFavoriteId(favorite.map((elem) => elem.article_id));
    }
  }, [favorite]);

  const handleFavoriteList = (target) => {
    setShowFavoriteList(!showFavoriteList);
    target.classList.toggle('selected-like-filter');
  };
  return (
    <div className="containerFeed">
      <div className="searchArticleSelect">
        <Select
          isMulti
          name="articles"
          placeholder="rechercher votre article"
          options={articleOption}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => {
            handleSelectArticleChange(e);
          }}
        />
      </div>
      <div className="filterContainer">
        <button
          type="button"
          className="buttonPres"
          onClick={(e) => handleFavoriteList(e.target)}
        />
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
        {showFavoriteList &&
          favorite.map((e) => {
            return (
              <div key={e.article_id} className="articlesRow">
                <Link to={`/articles/${e.article_id}`}>
                  <div className="articlesInfos">
                    <img
                      className="imgArticle"
                      src={`${URL}/${e.article_url}`}
                      alt="jardin"
                    />
                    <div className="text">{e.article_title}</div>
                  </div>
                </Link>
              </div>
            );
          })}
        {!showFavoriteList && (
          <>
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
                        <Link to={`/articles/${e.id}`}>
                          <div className="articlesInfos">
                            <img
                              className="imgArticle"
                              src={`${URL}/${e.url}`}
                              alt="jardin"
                            />
                            <div className="text">{e.title}</div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
              : articles.map((e) => {
                  return (
                    <div key={e.id} className="articlesRow">
                      <Link
                        className="Link-to-articleDetails"
                        to={`/articles/${e.id}`}
                      >
                        <div className="articlesInfos">
                          <img
                            className="imgArticle"
                            src={`${URL}/${e.url}`}
                            alt="jardin"
                          />
                          <div className="text">{e.title}</div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
          </>
        )}
      </div>
    </div>
  );
};
export default Feed;
