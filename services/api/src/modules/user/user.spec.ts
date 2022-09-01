import { CONTROLLER } from 'enum/controller.enum';
import { describeModule } from 'test.helper.spec';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
export default function TestUserModule() {
  describeModule(CONTROLLER.USER, async (test) => {
    const createData = {
      email: 'test@mailinator.com',
      world: global.MOCK.world._id.toString(),
      password: '123123',
    };
    test
      .post<SignupDto>(
        'should created',
        (req) => {
          return req.expect(201);
        },
        {
          params: 'signup',
          body: createData,
        },
      )
      .each([
        {
          email: 'test@mailinator.com',
          world: global.MOCK.world._id.toString(),
          password: '123123',
        },
        { email: 'test@mailinator.com', world: '123', password: '123123' },
        {
          email: 'test2@mailinator.com',
          world: global.MOCK.world._id.toString(),
          password: '1',
        },
      ])
      .post(
        'Should signup throw error email=$email world=$world password=$password',
        (req) => {
          return req.expect(400);
        },
        {
          params: 'signup',
        },
      )
      .post<SigninDto>(
        'Should login successfully',
        (req) => {
          return req
            .expect(201)
            .expect((res) => expect(res.body.data.token).toBeTruthy());
        },
        {
          params: 'signin',
          body: {
            email: global.MOCK.user.email,
            password: global.MOCK.user.password,
            world: global.MOCK.world._id.toString(),
          },
        },
      )
      .post(
        'Should login fail',
        (req) => {
          return req.expect(400);
        },
        {
          params: 'signin',
          body: {
            email: 'dummy',
            password: global.MOCK.user.password,
            world: global.MOCK.world._id.toString(),
          },
        },
      );
  });
}
