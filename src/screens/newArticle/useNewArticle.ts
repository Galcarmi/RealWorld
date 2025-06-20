import { useCallback, useState, useMemo } from 'react';
import { Keyboard } from 'react-native';

import { articlesStore } from '../../store/articlesStore';

import { navigationService } from '../../services/navigationService';
import { CreateArticleRequest } from '../../services/types';

import { useTranslation } from '../../hooks/useTranslation';
import { showErrorAlert } from '../../utils';

export const useNewArticle = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onTitleChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const onDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const onBodyChange = useCallback((text: string) => {
    setBody(text);
  }, []);

  const validateArticleContent = useCallback(() => {
    return title.trim() && description.trim() && body.trim();
  }, [title, description, body]);

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
    const articleData = createArticleData();
    await articlesStore.createArticle(articleData);
    resetArticleForm();
    navigationService.navigateToMainTabs();
  }, [createArticleData, resetArticleForm]);

  const onPublishArticle = useCallback(async () => {
    if (!validateArticleContent()) {
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await handleArticleCreation();
    } catch {
      showErrorAlert(t('errors.failedToCreateArticle'));
    } finally {
      setIsLoading(false);
    }
  }, [validateArticleContent, handleArticleCreation, t]);

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

  return {
    title,
    description,
    body,
    isLoading,
    canPublish,
    onTitleChange,
    onDescriptionChange,
    onBodyChange,
    onPublishArticle,
    onGoBack,
  };
};
