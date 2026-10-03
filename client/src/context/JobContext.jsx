import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchJobs } from '../services/jobService';

export const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    workMode: '',
    jobType: '',
    skill: '',
    sort: 'latest',
    page: 1,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });

  const loadJobs = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = { ...filters, ...customFilters };
      const res = await fetchJobs(activeFilters);
      if (res.success) {
        setJobs(res.data || []);
        if (res.meta) {
          setPagination(res.meta);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadJobs();
  }, [filters.search, filters.location, filters.workMode, filters.jobType, filters.sort, filters.page]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      workMode: '',
      jobType: '',
      skill: '',
      sort: 'latest',
      page: 1,
    });
  };

  const value = {
    jobs,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    refreshJobs: loadJobs,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
