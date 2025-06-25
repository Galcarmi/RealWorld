import { useCallback, useState, useMemo, useEffect } from 'react';
import { Keyboard } from 'react-native';

import { articlesStore } from '../../store/articlesStore';

import { useTranslation } from '../../hooks/useTranslation';
import {
  CreateArticleRequest,
  navigationService,
  articleService,
} from '../../services';
import { showErrorAlert } from '../../utils';

export const useArticleForm = (slug?: string) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchArticleForEdit = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    try {
      const response = await articleService.getArticle(slug);
      const article = response.article;
      setTitle(article.title);
      setDescription(article.description);
      setBody(article.body);
      setIsEditMode(true);
    } catch {
      showErrorAlert(t('errors.failedToFetchArticle'));
    } finally {
      setIsLoading(false);
    }
  }, [slug, t]);

  useEffect(() => {
    if (slug) {
      fetchArticleForEdit();
    }
  }, [slug, fetchArticleForEdit]);

  const onTitleChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const onDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const onBodyChange = useCallback((text: string) => {
    setBody(text);
  }, []);

  const createArticleData = useCallback((): CreateArticleRequest => {
    return {
      title: title.trim(),
      description: description.trim(),
      body: body.trim(),
    };
  }, [title, description, body]);

  const resetArticleForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setBody('');
  }, []);

  const handleArticleCreation = useCallback(async () => {
    try {
      const articleData = createArticleData();
      await articlesStore.createArticle(articleData);
      resetArticleForm();
      navigationService.navigateToMainTabs();
    } catch {
      showErrorAlert(t('errors.failedToCreateArticle'));
    }
  }, [createArticleData, resetArticleForm, t]);

  const handleArticleUpdate = useCallback(async () => {
    if (!slug) return;

    try {
      const articleData = createArticleData();
      await articleService.updateArticle(slug, articleData);
      navigationService.goBack();
    } catch {
      showErrorAlert(t('errors.failedToCreateArticle'));
    }
  }, [slug, createArticleData, t]);

  const onGoBack = useCallback(() => {
    navigationService.navigateToMainTabs();
  }, []);

  const calculateCanPublish = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedBody = body.trim();

    return (
      trimmedTitle.length > 0 &&
      trimmedDescription.length > 0 &&
      trimmedBody.length > 0
    );
  }, [title, description, body]);

  const canPublish = useMemo(() => {
    return calculateCanPublish();
  }, [calculateCanPublish]);

  const onFormSubmit = useCallback(() => {
    Keyboard.dismiss();
    if (isEditMode) {
      handleArticleUpdate();
    } else {
      handleArticleCreation();
    }
  }, [isEditMode, handleArticleUpdate, handleArticleCreation]);

  return {
    title,
    description,
    body,
    isLoading,
    canPublish,
    isEditMode,
    onTitleChange,
    onDescriptionChange,
    onBodyChange,
    onFormSubmit,
    onGoBack,
  };
};
