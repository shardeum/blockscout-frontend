import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { STATS_CHARTS } from 'stubs/stats';

function isSectionMatches(section: stats.LineChartSection, currentSection: string): boolean {
  return currentSection === 'all' || section.id === currentSection;
}

function isChartNameMatches(q: string, chart: stats.LineChartInfo) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}

const CHARTS_TO_REMOVE = [
  'newVerifiedContracts', 
  'verifiedContractsGrowth',
  'contractsGrowth',
  'newContracts',
  'userOperations',
  'aaWallets',
  'activeBundlers',
  'activePaymasters'
];

const CHART_TITLES_TO_REMOVE = [
  'verified contract',
  'contract',
  'user operation',
  'aa wallet',
  'bundler',
  'paymaster'
];

export default function useStats() {
  const router = useRouter();

  const { data, isPlaceholderData, isError } = useApiQuery('stats_lines', {
    queryOptions: {
      placeholderData: STATS_CHARTS,
    },
  });

  const [ currentSection, setCurrentSection ] = useState('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ initialFilterQuery, setInitialFilterQuery ] = React.useState('');
  const [ interval, setInterval ] = useState<StatsIntervalIds>('oneMonth');
  const sectionIds = useMemo(() => data?.sections?.map(({ id }) => id), [ data ]);

  React.useEffect(() => {
    if (!isPlaceholderData && !isError) {
      const chartId = getQueryParamString(router.query.chartId);
      const chartName = data?.sections.map((section) => section.charts.find((chart) => chart.id === chartId)).filter(Boolean)[0]?.title;
      if (chartName) {
        setInitialFilterQuery(chartName);
        setFilterQuery(chartName);
        router.replace({ pathname: '/stats' }, undefined, { scroll: false });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  const displayedCharts = React.useMemo(() => {
    return data?.sections
      ?.map((section) => {
        if (section.id === 'contracts' || section.id === 'userOperations' || section.id === 'accountAbstraction') {
          return {
            ...section,
            charts: [],
          };
        }

        const charts = section.charts.filter((chart) => {
          if (CHARTS_TO_REMOVE.includes(chart.id)) {
            return false;
          }
          
          if (CHART_TITLES_TO_REMOVE.some(phrase => 
            chart.title.toLowerCase().includes(phrase.toLowerCase()))) {
            return false;
          }
          
          return isSectionMatches(section, currentSection) && isChartNameMatches(filterQuery, chart);
        });

        return {
          ...section,
          charts,
        };
      }).filter((section) => section.charts.length > 0);
  }, [ currentSection, data?.sections, filterQuery ]);

  const handleSectionChange = useCallback((newSection: string) => {
    setCurrentSection(newSection);
  }, []);

  const handleIntervalChange = useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  const handleFilterChange = useCallback((q: string) => {
    setFilterQuery(q);
  }, []);

  return React.useMemo(() => ({
    sections: data?.sections,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  }), [
    data,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  ]);
}
