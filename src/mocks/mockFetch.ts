export default function mockFetch(url: string) {
  switch (url) {
    case "/info": {
      return {
        success: true,
        data: {
          info: "test",
        },
      };
    }
    case "/login": {
      return {
        success: true,
        data: {
          token: "token",
        },
      };
    }
    case "/profile": {
      return {
        success: true,
        data: {
          fullname: "test",
          email: "test",
        },
      };
    }
    case "/author": {
      return {
        success: true,
        data: {
          authorId: 1,
          name: "test",
        },
      };
    }
    case "/quote": {
      return {
        success: true,
        data: {
          authorId: 1,
          quoteId: 3,
          quote: "test",
        },
      };
    }
    default: {
      throw new Error(`Unhandled request: ${url}`);
    }
  }
}
