import { PRIVATE_ROUTES } from '@/routes';
import { api } from '@lib/api';
import { BASE_API } from '@lib/secret';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import useAsync from './useAsync';

const DEFAULT_OPTIONS = {
	headers: {
		'Content-Type': 'application/json',
		authorization: Cookies.get('auth'),
	},
};

const defaultFetch = async (url) => {
	const response = await api.get(url);
	return response?.data;
};

function useFetch(url, dependencies = []) {
	return useAsync(async () => {
		return await fetch(`${BASE_API}${url}`, DEFAULT_OPTIONS).then(
			async (res) => {
				if (res.ok) return res.json();
				const json = await res.json();
				return await Promise.reject(json);
			}
		);
	}, dependencies);
}

// async function useFetch(url, dependencies = []) {
// 	const val = await api.get(url).then((res) => res?.data?.data);

// 	return val;
// }

async function defaultFetchFunc(
	url,
	setData,
	setLoading,
	setError,
	singleData = false
) {
	setLoading(true);
	setError(null);
	await api
		.get(url)
		.then((res) => setData(singleData ? res?.data[0] : res?.data))
		.catch((err) => setError(err?.response?.data))
		.finally(() => setLoading(false));
}

async function useFetchFunc(url, setData, setLoading, setError) {
	await defaultFetchFunc(url, setData, setLoading, setError);
}

async function useFetchFuncForReport(url, setData, setLoading, setError) {
	await defaultFetchFunc(url, setData, setLoading, setError, true);
}

const useFetchForRhfReset = async (uri, returnId, reset) => {
	useEffect(() => {
		if (returnId === null || returnId === undefined) return;

		api.get(uri).then((res) => reset(res?.data?.data[0]));
	}, [returnId]);
};

const useFetchForRhfResetForOrder = async (uri, returnId, reset) => {
	useEffect(() => {
		if (returnId === null || returnId === undefined) return;

		api.get(uri).then((res) => reset(res?.data));
	}, [returnId]);
};

const useFetchForRhfResetForUserAccess = async (uri, returnId, reset) => {
	useEffect(() => {
		if (returnId === null) return;

		api.get(uri).then((res) => {
			const data = res?.data?.data[0];
			const result = {};

			Object.entries(data).forEach(([key, value]) => {
				const val = JSON.parse(value);
				Object.entries(val).forEach(([k, v]) => {
					v.forEach((item) => {
						const obj_key = k + '___' + item;
						result[obj_key] = true;
					});
				});
			});

			const PAGE_ACTIONS = PRIVATE_ROUTES?.filter(
				(item) => item.actions !== undefined
			)?.reduce((acc, { page_name, actions }) => {
				actions.forEach((action) => {
					const key = page_name + '___' + action;
					acc[key] = Boolean(result?.[key]);
				});
				return acc;
			}, {});

			reset(PAGE_ACTIONS);
		});
	}, [returnId, reset]);
};

export {
	defaultFetch,
	useFetch,
	useFetchForRhfReset,
	useFetchForRhfResetForOrder,
	useFetchForRhfResetForUserAccess,
	useFetchFunc,
	useFetchFuncForReport,
};
