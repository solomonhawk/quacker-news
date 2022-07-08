import { useRouter } from 'next/router';
import qs from 'query-string';
import { useRef } from 'react';
import { OrderType, orderTypeLabels, SearchType, searchTypeLabels } from 'server/domains/search/helpers';

export const SearchPageForm = ({
  children,
  type,
  order,
  searchTerm,
}: {
  children: React.ReactNode;
  type?: string;
  order?: string;
  searchTerm?: string;
}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement | HTMLSelectElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const queryParams = {
      q: formData.get('q'),
      type: formData.get('type'),
      order: formData.get('order'),
    };

    router.push(`/search?${qs.stringify(queryParams)}`);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} ref={formRef} className="p-2 flex gap-4">
        <select name="type" onChange={handleSubmit} defaultValue={type}>
          {Object.values(SearchType).map(type => (
            <option key={type} value={type}>
              {searchTypeLabels[type as SearchType]}
            </option>
          ))}
        </select>

        <select name="order" onChange={handleSubmit} defaultValue={order}>
          {Object.values(OrderType).map(type => (
            <option key={type} value={type}>
              {orderTypeLabels[type as OrderType]}
            </option>
          ))}
        </select>

        <div>
          <label htmlFor="query">Search: </label>
          <input
            id="query"
            type="text"
            name="q"
            defaultValue={searchTerm}
            className="border border-gray-500 rounded-sm text-sm p-[2px]"
          />
        </div>
      </form>
      {children}
    </div>
  );
};
