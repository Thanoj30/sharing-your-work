import { useEffect, useState } from 'react';
import {
  getFriendRequests,
  getFriends,
  respondToFriendRequest,
  searchUsers,
  sendFriendRequest
} from '../services/api.js';

function Friends() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadFriendData = async () => {
    try {
      const [requestsResponse, friendsResponse] = await Promise.all([
        getFriendRequests(),
        getFriends()
      ]);

      setRequests(requestsResponse.data.requests);
      setFriends(friendsResponse.data.friends);
    } catch (_error) {
      setError('Could not load friends data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFriendData();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await searchUsers(query);
      setSearchResults(response.data.users);
    } catch (_error) {
      setError('Could not search users.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (recipientId) => {
    setError('');
    setMessage('');

    try {
      await sendFriendRequest(recipientId);
      setSearchResults((currentResults) => (
        currentResults.map((user) => (
          user.id === recipientId
            ? { ...user, friendship: { status: 'pending', direction: 'outgoing' } }
            : user
        ))
      ));
      setMessage('Friend request sent.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not send friend request.');
    }
  };

  const handleRespond = async (requestId, action) => {
    setError('');
    setMessage('');

    try {
      await respondToFriendRequest(requestId, action);
      setRequests((currentRequests) => (
        currentRequests.filter((request) => request.id !== requestId)
      ));
      await loadFriendData();
      setMessage(action === 'accept' ? 'Friend request accepted.' : 'Friend request rejected.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not update friend request.');
    }
  };

  const getSearchAction = (user) => {
    if (!user.friendship) {
      return (
        <button
          className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
          type="button"
          onClick={() => handleSendRequest(user.id)}
        >
          Add Friend
        </button>
      );
    }

    const label = user.friendship.status === 'accepted'
      ? 'Friends'
      : user.friendship.direction === 'incoming'
        ? 'Request received'
        : 'Request sent';

    return (
      <span className="rounded-md bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-600">
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-7">
      <section>
        <p className="text-sm font-semibold uppercase text-teal-700">Friends</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">Build your help network</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Search for users, send friend requests, and manage your trusted community contacts.
        </p>
      </section>

      {(error || message) && (
        <div
          className={[
            'rounded-md border px-4 py-3 text-sm',
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-teal-200 bg-teal-50 text-teal-800'
          ].join(' ')}
        >
          {error || message}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <form
            className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
            onSubmit={handleSearch}
          >
            <h3 className="text-xl font-bold text-slate-950">Search users</h3>
            <label className="mt-5 block">
              <span className="text-sm font-medium text-slate-700">Name or email</span>
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search community users"
              />
            </label>
            <button
              className="mt-5 w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              type="submit"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search Users'}
            </button>
          </form>

          <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-slate-950">Friend requests</h3>
            {isLoading ? (
              <p className="mt-5 text-sm text-slate-600">Loading requests...</p>
            ) : requests.length === 0 ? (
              <p className="mt-5 text-sm text-slate-600">No pending friend requests.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {requests.map((request) => (
                  <article className="rounded-md border border-slate-200 p-4" key={request.id}>
                    <p className="font-bold text-slate-950">{request.requester.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{request.requester.email}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
                        type="button"
                        onClick={() => handleRespond(request.id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-500 hover:text-red-600"
                        type="button"
                        onClick={() => handleRespond(request.id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Search results</h3>
                <p className="mt-1 text-sm text-slate-600">Send friend requests to users you know.</p>
              </div>
              <p className="text-sm font-semibold text-teal-700">{searchResults.length} found</p>
            </div>

            {searchResults.length === 0 ? (
              <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">Search by name or email to find users.</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {searchResults.map((user) => (
                  <article className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={user.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold text-slate-950">{user.name}</p>
                        <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
                        <p className="mt-2 text-sm text-slate-600">Help count: {user.helpCount}</p>
                      </div>
                      {getSearchAction(user)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Friends list</h3>
                <p className="mt-1 text-sm text-slate-600">Accepted community contacts.</p>
              </div>
              <p className="text-sm font-semibold text-teal-700">{friends.length} friends</p>
            </div>

            {isLoading ? (
              <p className="mt-6 text-sm text-slate-600">Loading friends...</p>
            ) : friends.length === 0 ? (
              <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">Accepted friends will appear here.</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {friends.map((friend) => (
                  <article className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={friend.id}>
                    <p className="text-lg font-bold text-slate-950">{friend.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{friend.email}</p>
                    <p className="mt-2 text-sm text-slate-600">Help count: {friend.helpCount}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

export default Friends;

