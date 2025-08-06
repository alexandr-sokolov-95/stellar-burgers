export const mockFetch = (response = { result: 'ok' }) => {
  jest
    .spyOn(global, 'fetch')
    .mockImplementation(
      jest.fn(() =>
        Promise.resolve({ json: () => Promise.resolve(response) })
      ) as jest.Mock
    );
};
